import Image from "next/image";

export default function NixWebring() {
  return (
    <ul className="pointless webring">
      <li>
        <a href="https://nixwebr.ing/prev/vimlinuz">&#x25D6;&nbsp;prev</a>
      </li>
      <li>
        <a href="https://nixwebr.ing">Nix Webring</a>
      </li>
      <li>
        <div id="nix-wrapper">
          <Image
            id="nix"
            src="/nix.svg"
            alt="Nix logo"
            width={15}
            height={15}
            onClick={() =>
              window.open("https://github.com/vimlinuz/nixos", "_blank")
            }
          />
        </div>
      </li>
      <li>
        <a href="https://nixwebr.ing/rand">Random</a>
      </li>
      <li>
        <a href="https://nixwebr.ing/next/vimlinuz">next&nbsp;&#x25D7;</a>
      </li>
    </ul>
  );
}
