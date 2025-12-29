// Admin Authentication Utilities

// Basit hash fonksiyonu (production'da bcrypt kullanılmalı)
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Şifre doğrulama
export const verifyPassword = async (password, hash) => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Admin giriş fonksiyonu
export const adminLogin = async (supabase, username, password) => {
  try {
    // Kullanıcıyı bul
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      // Login attempt kaydet (başarısız)
      await supabase.from('admin_login_attempts').insert([{
        username,
        success: false,
        ip_address: null, // Browser'da IP alınamaz
        user_agent: navigator.userAgent
      }]);

      return { success: false, error: 'Kullanıcı adı veya şifre hatalı!' };
    }

    // Hesap kilitli mi kontrol et
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      return { 
        success: false, 
        error: 'Hesabınız geçici olarak kilitlendi. Lütfen daha sonra tekrar deneyin.' 
      };
    }

    // Şifre kontrolü
    const passwordHash = await hashPassword(password);
    if (passwordHash !== admin.password_hash) {
      // Başarısız giriş denemesi sayısını artır
      const newAttempts = (admin.login_attempts || 0) + 1;
      const updateData = { login_attempts: newAttempts };

      // 5 başarısız denemeden sonra hesabı 15 dakika kilitle
      if (newAttempts >= 5) {
        updateData.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }

      await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', admin.id);

      // Login attempt kaydet (başarısız)
      await supabase.from('admin_login_attempts').insert([{
        username,
        success: false,
        ip_address: null,
        user_agent: navigator.userAgent
      }]);

      return { 
        success: false, 
        error: newAttempts >= 5 
          ? 'Çok fazla başarısız deneme! Hesabınız 15 dakika kilitlendi.' 
          : `Kullanıcı adı veya şifre hatalı! (${5 - newAttempts} deneme hakkınız kaldı)` 
      };
    }

    // Başarılı giriş
    await supabase
      .from('admin_users')
      .update({ 
        last_login: new Date().toISOString(),
        login_attempts: 0,
        locked_until: null
      })
      .eq('id', admin.id);

    // Login attempt kaydet (başarılı)
    await supabase.from('admin_login_attempts').insert([{
      username,
      success: true,
      ip_address: null,
      user_agent: navigator.userAgent
    }]);

    return { 
      success: true, 
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name
      }
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' };
  }
};

// Şifre değiştirme fonksiyonu
export const changeAdminPassword = async (supabase, adminId, oldPassword, newPassword) => {
  try {
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('id', adminId)
      .single();

    if (error || !admin) {
      return { success: false, error: 'Admin kullanıcısı bulunamadı!' };
    }

    // Eski şifre kontrolü
    const oldPasswordHash = await hashPassword(oldPassword);
    if (oldPasswordHash !== admin.password_hash) {
      return { success: false, error: 'Mevcut şifreniz hatalı!' };
    }

    // Yeni şifre hash'le ve güncelle
    const newPasswordHash = await hashPassword(newPassword);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newPasswordHash })
      .eq('id', adminId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Şifre değiştirilemedi!' };
  }
};
