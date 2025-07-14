import toast, {
	resolveValue,
	Toaster,
	ToastIcon,
	type Toast,
} from "react-hot-toast";

const CustomToaster = () => {
	const renderToast = (t: Toast) => {
		return (
			<div className="flex bg-white justify-evenly items-center text-black gap-3 rounded-md p-2">
				<ToastIcon toast={t} />
				{resolveValue(t.message, t)}
				{t.type !== "loading" && (
					<>
						<div className="border-l-[1px] border-l-black h-full"></div>
						<button
							className="font-semibold cursor-pointer"
							onClick={() => {
								toast.remove(t.id);
							}}
						>
							X
						</button>
					</>
				)}
			</div>
		);
	};
	return <Toaster>{(t) => renderToast(t)}</Toaster>;
};

export default CustomToaster;
