interface Comment {
  id: number;
  name: string;
  date: string;
  text: string;
}

const comments: Comment[] = [
  {
    id: 1,
    name: "Ana Silva",
    date: "07/10/2025",
    text: "Adorei o lugar! Muito bonito e bem cuidado.",
  },
  {
    id: 2,
    name: "Carlos Souza",
    date: "06/10/2025",
    text: "Trilhas incríveis e ambiente super agradável.",
  },
  {
    id: 3,
    name: "Beatriz Lima",
    date: "05/10/2025",
    text: "Recomendo para quem quer passar o dia em família.",
  },
  {
    id: 4,
    name: "Pedro Santos",
    date: "04/10/2025",
    text: "Ótimo para quem gosta de natureza e passeios ao ar livre.",
  },
];

export default function CommentList() {
  return (
    <div>
      <h1 className="lg:text-2xl text-base font-semibold text-gray-800">
        Comentários{" "}
      </h1>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 ">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {/* Div redonda cinza para avatar */}
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <h3 className="font-semibold">{comment.name}</h3>
              </div>
              <span className="text-sm text-gray-500">{comment.date}</span>
            </div>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
