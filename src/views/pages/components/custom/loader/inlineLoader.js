import { useLottie } from "lottie-react";
import animation from "./inline-animation.json";

const InlineLoader = () => {
    const options = {
        animationData: animation,
        loop: true,
        autoplay: true,

    }
    
    const { View } = useLottie(options);
    return View;
}

export default InlineLoader;