import { motion } from "framer-motion";

const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingDots;
