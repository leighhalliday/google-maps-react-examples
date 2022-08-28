import Link from "next/link";

function App() {
  return (
    <ul>
      <li>
        <Link href="/data">Data Driven Styling</Link>
      </li>
      <li>
        <Link href="/cluster">Marker Clustering</Link>
      </li>
      <li>
        <Link href="/hooks">Maps &amp; Hooks</Link>
      </li>
    </ul>
  );
}

export default App;
