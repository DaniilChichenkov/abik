export const Header = ({ content }: { content: string }) => {
  return (
    <header>
      <h2 className="text-2xl font-bold">{content}:</h2>
    </header>
  );
};

export default Header;
