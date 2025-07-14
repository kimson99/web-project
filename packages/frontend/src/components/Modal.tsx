import { useEffect, useRef, type PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren {
	isOpen: boolean;
	onClose?: () => void;
	title?: string;
}

const Modal = ({ isOpen, title, children, onClose }: ModalProps) => {
	const ref = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		if (!ref.current) {
			return;
		}
		if (isOpen) {
			ref.current.showModal();
		} else {
			ref.current.close();
		}
	}, [isOpen]);

	return (
		<dialog ref={ref} className={"modal"}>
			<div className="modal-box">
				{title && <h3 className="font-bold text-lg">{title}</h3>}
				{children}
			</div>
			<form
				method="dialog"
				onClick={() => onClose?.()}
				className="modal-backdrop"
			></form>
		</dialog>
	);
};

export default Modal;
