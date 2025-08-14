import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { bookIndex, authorIndex } from "@repo/api";
import SearchInput from "../components/Browse/SearchInput";
import SearchTabs from "../components/Browse/SearchTabs";
import BooksGrid from "../components/Browse/BooksGrid";
import AuthorsGrid from "../components/Browse/AuthorsGrid";

type SearchParams = {
	q?: string;
};

const Browse = () => {
	const { q } = Route.useSearch();
	const navigate = Route.useNavigate();
	const [searchQuery, setSearchQuery] = useState(q || "");
	const [activeTab, setActiveTab] = useState<"books" | "authors">("books");

	// Books infinite query
	const booksQuery = useInfiniteQuery({
		queryKey: ["books-search", q],
		queryFn: ({ pageParam = 0 }) =>
			bookIndex({
				query: {
					search: q || "",
					skip: pageParam,
					take: 20,
				},
			}),
		enabled: !!q?.trim(),
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.data?.meta?.has_more) {
				return pages.length * 20;
			}
			return undefined;
		},
		initialPageParam: 0,
	});

	// Authors infinite query
	const authorsQuery = useInfiniteQuery({
		queryKey: ["authors-search", q],
		queryFn: ({ pageParam = 0 }) =>
			authorIndex({
				query: {
					search: q || "",
					skip: pageParam,
					take: 20,
				},
			}),
		enabled: !!q?.trim(),
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.data?.meta?.has_more) {
				return pages.length * 20;
			}
			return undefined;
		},
		initialPageParam: 0,
	});

	// Update search query when URL changes
	useEffect(() => {
		if (q && q.trim()) {
			setSearchQuery(q);
		}
	}, [q]);

	// Destructure query states
	const {
		data: booksData,
		isPending: booksLoading,
		hasNextPage: booksHasNext,
		fetchNextPage: fetchMoreBooks,
		isFetchingNextPage: booksFetching,
	} = booksQuery;
	const {
		data: authorsData,
		isPending: authorsLoading,
		hasNextPage: authorsHasNext,
		fetchNextPage: fetchMoreAuthors,
		isFetchingNextPage: authorsFetching,
	} = authorsQuery;

	// Flatten data from all pages
	const books = booksData?.pages.flatMap((page) => page.data?.data || []) || [];
	const authors =
		authorsData?.pages.flatMap((page) => page.data?.data || []) || [];
	const hasSearched = !!q?.trim();

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		// Update URL with search query
		navigate({ search: { q: searchQuery } });
	};

	// Reset pagination when switching tabs
	const handleTabChange = (tab: "books" | "authors") => {
		setActiveTab(tab);
	};


	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">
					Browse Books & Authors
				</h1>

				<SearchInput
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onSearch={handleSearch}
				/>

				{hasSearched && (
					<>
						<SearchTabs
							activeTab={activeTab}
							onTabChange={handleTabChange}
							booksCount={books.length}
							authorsCount={authors.length}
						/>

						<div className="min-h-96">
							{activeTab === "books" && (
								<BooksGrid
									books={books}
									isLoading={booksLoading}
									hasNextPage={booksHasNext}
									isFetchingNextPage={booksFetching}
									onLoadMore={fetchMoreBooks}
									searchQuery={q || ""}
								/>
							)}

							{activeTab === "authors" && (
								<AuthorsGrid
									authors={authors}
									isLoading={authorsLoading}
									hasNextPage={authorsHasNext}
									isFetchingNextPage={authorsFetching}
									onLoadMore={fetchMoreAuthors}
									searchQuery={q || ""}
								/>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export const Route = createFileRoute("/browse")({
	component: Browse,
	validateSearch: (search: Record<string, unknown>): SearchParams => ({
		q: search.q as string,
	}),
});
