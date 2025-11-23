import { PulseLoader } from 'react-spinners';

export default function ButtonSpinner() {
  return (
  <div className="" style={{
    width: "100%", 
    display: "flex", 
    justifyContent: "center",
    alignItems: "start"}}><PulseLoader
  color="#ffffffff"
  margin={0}
  size={15}
/></div>
  );
}
