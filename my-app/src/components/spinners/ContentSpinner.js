import { PulseLoader } from 'react-spinners';

export default function ContentSpinner() {
  return (
  <div className="loading-spinner" style={{height: "100vh", width: "100%", display: "flex", alignItems: "start"}}><PulseLoader
  color="#c2c46b"
  margin={0}
  size={15}
/></div>
  );
}
