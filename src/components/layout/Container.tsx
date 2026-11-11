
type Props = {
  as?: "div" | "main" | "section";
  className?: string;
  children: React.ReactNode;
};

export default function Container({
  as: Tag = "div",
  className = "",
  children,
}: Props) {
  return <Tag className={`wrap ${className}`}>{children}</Tag>;
}