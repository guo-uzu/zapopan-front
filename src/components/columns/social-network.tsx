import { Badge } from "../ui/badge";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter, FaSquareInstagram } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { CellContext } from "@tanstack/react-table";
import { BitacoraRecord } from "@/types/bitacoraTable";

const SocialNetwork = ({ props }: { props: CellContext<BitacoraRecord, unknown> }) => {
  const color: string | undefined = ColumnsBitacoraOpts.social_network.find(
    (e) => e.id === props.getValue(),
  )?.color;
  return (
    <Badge
      style={{ color: color }}
      className="capitalize w-full rounded-full bg-current/10 border-none focus-visible:ring-amber-600/20 focus-visible:outline-none"
    >
      {props.getValue() === "facebook" ? (
        <FaFacebookSquare />
      ) : props.getValue() === "x" ? (
        <FaSquareXTwitter />
      ) : props.getValue() === "instagram" ? (
        <FaSquareInstagram />
      ) : props.getValue() === "tiktok" ? (
        <AiFillTikTok />
      ) : (
        ""
      )}
      {props.getValue() as string}
    </Badge>
  );
};

export default SocialNetwork;
