const Button: React.FC<{
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
	children: React.ReactNode;
  }> = props => {
	const buttonClassName = `btn ${
	  props.disabled
		? 'bg-gray-500 cursor-not-allowed'
		: ''
	} ${props.className}`;
  
	return (
	  <button className={buttonClassName} onClick={props.onClick} disabled={props.disabled}>
		{props.children}
	  </button>
	);
  };
  
  export default Button;
  