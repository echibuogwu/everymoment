/**
 * ShareMomentPage — handles the public share link route /moment/:momentId
 *
 * Reads the momentId from /moment/$momentId path and delegates to
 * MomentDetailContent. This avoids useParams({ from }) path conflicts.
 */
import { useParams } from "@tanstack/react-router";
import { MomentDetailContent } from "./MomentDetailPage";

export function ShareMomentPage() {
  const { momentId } = useParams({ from: "/moment/$momentId" });
  return <MomentDetailContent momentId={momentId} />;
}
