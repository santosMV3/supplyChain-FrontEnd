import { useLottie } from "lottie-react";
import animation from "./animation.json";

const Loader = () => {
    const options = {
        animationData: animation,
        loop: true,
        autoplay: true,

    }
    
    const { View } = useLottie(options);
    return View;
}

export default Loader;