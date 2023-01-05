import { useState } from "react"
import { useReadOTP } from "react-read-otp";

export default function MyAccountAutoDetectOTP(props) {
    const { updateOTP } = props;
    const [otp, setOTP] = useState(null);

    useReadOTP(setOTP);
    if (otp) {
        updateOTP(otp);
    }
    return null;
}