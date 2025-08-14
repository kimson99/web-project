import { type BookResource } from "@repo/api";
import SimilarBooks from "./SimilarBooks";

interface OverviewTabProps {
	book: BookResource;
}

const OverviewTab = ({ book }: OverviewTabProps) => (
	<SimilarBooks book={book} />
);

export default OverviewTab;