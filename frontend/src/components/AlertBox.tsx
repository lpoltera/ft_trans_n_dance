interface Props {
	message: string;
	color: string;
  }
  
  const AlertBox = ({ message, color }: Props) => {
	const style = { color: color }; 
  
	return (
	  <div id="alert" style={style}>{message}</div>
	);
  }
  
  export default AlertBox;