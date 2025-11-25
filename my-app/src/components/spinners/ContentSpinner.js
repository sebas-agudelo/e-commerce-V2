import { PulseLoader } from 'react-spinners';

export default function ContentSpinner() {
  return (
  <div className="loading-spinner" style={{height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignContent: "center"}}><PulseLoader
  color="#f5752b"
  margin={0}
  size={15}
/></div>
  );
}
