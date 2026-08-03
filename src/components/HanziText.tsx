import Link from "next/link";

const CJK = /[一-鿿]/;

// Les Hanzi comme objets visuels (PRD §9) : chaque caractère est cliquable
// et mène à sa fiche (composition, étymologie, famille).
// `mixed` : pour un texte français contenant des Hanzi — seuls les caractères
// chinois reçoivent la police CJK, le reste garde la police de l'interface.
export function HanziText({
  text,
  className,
  mixed = false,
}: {
  text: string;
  className?: string;
  mixed?: boolean;
}) {
  return (
    <span className={`${mixed ? "" : "hanzi"} ${className ?? ""}`}>
      {Array.from(text).map((ch, i) =>
        CJK.test(ch) ? (
          <Link
            key={i}
            href={`/hanzi/${encodeURIComponent(ch)}`}
            className="hanzi rounded-sm hover:bg-accent-soft hover:text-accent"
          >
            {ch}
          </Link>
        ) : (
          <span key={i}>{ch}</span>
        )
      )}
    </span>
  );
}
