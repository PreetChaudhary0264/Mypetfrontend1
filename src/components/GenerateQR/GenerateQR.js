import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './GenerateQR.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import qrcodeImage from './images/qr-code.png';

const GenerateQR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [owner, setOwner] = useState({
    phone: '',
    email: ''
  });
  const [pet, setPet] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load pet data if coming from registration
  // useEffect(() => {
  //   if (location.state?.pet) {
  //     setPet(location.state.pet);
  //   }
  // }, [location]);
  useEffect(() => {
  if (location.state?.pet && location.state?.qrUrl) {
    setPet(location.state.pet);
    setQrValue(location.state.qrUrl);
  }
}, [location]);


  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwner({ ...owner, [name]: value });
  };

  const generateQRCode = () => {
    if (!pet) {
     toast.success("Please register your pet first",{
             position:"top-center",
             autoClose:2000
           })
      return;
    }
const petDetailsUrl = `https://mypetfrontend1.vercel.app/petdetails/${pet._id}`;
// const petDetailsUrl = `http://localhost:3001/petdetails/${pet._id}`;
setQrValue(petDetailsUrl);

    setIsSubmitted(true);
  };

  const downloadQR = () => {
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const link = document.createElement("a");
    link.href = `data:image/svg+xml;base64,${btoa(svgData)}`;
    link.download = `mypet-qr-${pet.name}.svg`;
    link.click();
  };

  return (
   <div className='generate-qr-page'>
   <div className='main-container'>

    <div className="generate-qr-container">
      <h2>Generate Pet QR Code</h2>
      
      {!isSubmitted ? (
        <div className="qr-form">
          {pet && (
            <div className="pet-preview">
              <h3>Pet Details</h3>
              {pet.photoPreview && <img src={pet.photoPreview} alt={pet.name} />}
              <p><strong>Name:</strong> {pet.name}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age} years</p>
              {pet.bio && <p><strong>Bio:</strong> {pet.bio}</p>}
            </div>
          )}

          <div className="owner-details">
            <h3>Owner Contact Information</h3>
            <div className="form-group">
              <label>Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={owner.phone}
                onChange={handleOwnerChange}
                placeholder="+1 234 567 8900"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address*</label>
              <input
                type="email"
                name="email"
                value={owner.email}
                onChange={handleOwnerChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <button 
            onClick={generateQRCode}
            className="generate-btn"
            disabled={!owner.phone || !owner.email}
          >
            Generate QR Code
          </button>
        </div>
      ) : (
        <div className="qr-result">
          <div className="qr-code-display">
            <QRCodeSVG 
              value={qrValue} 
              size={200}
              fgColor="#4b9cd3"
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="qr-instructions">
            When scanned, this QR code will show:
            <br />
            <strong>{pet.name}'s</strong> details and your contact information
          </p>
          <div className="qr-actions">
            <button onClick={downloadQR} className="download-btn">
              Download QR Code
            </button>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="edit-btn"
            >
              Edit Information
            </button>
          </div>
        </div>
      )}
      {/* <ToastContainer/> */}
    </div>


   {/* //info section */}

    <section className='info-section'>
        
       <div className="qr-info-section">
        <div className="qr-info-text">
        <h2>What This QR Code Does</h2>
        <p>
         When scanned, this QR code instantly provides access to your pet’s details—such as their name,
         breed, age, and your contact information. It helps good Samaritans quickly reunite lost pets
         with their owners without needing any app or login.
        </p>
       <ul>
        <li>Pet details like name, breed, and bio</li>
        <li>Owner contact information (phone & email)</li>
        <li>Direct access via any QR scanner</li>
        <li>Secure and privacy-friendly link</li>
       </ul>
       </div>
       <div className="qr-info-image">
       <img src={qrcodeImage} alt="QR Code Example" className="blurred-qr" />
      </div>
     </div>

    </section>
    </div>
    </div>
  );
};

export default GenerateQR;