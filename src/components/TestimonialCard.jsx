function TestimonialCard({ text, author, role, avatar }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {avatar}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 italic mb-3 leading-relaxed">"{text}"</p>
          <div>
            <p className="font-bold text-gray-900">{author}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
