import { useLottie } from "lottie-react";
import animation from "./search-not-found.json";

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