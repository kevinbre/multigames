import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import ConfettiExplosion from "react-confetti-explosion";

import {RouletteValues, rouletteSchema} from "@/schemas/roulette-schema";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

interface Options {
    id: string;
    value: string;
}

export function Roulette() {
    const [options, setOptions] = useState<Options[]>([]);
    const [context, setContext] = useState<CanvasRenderingContext2D | null | undefined>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isExploding, setIsExploding] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wheelSoundRef = useRef<HTMLAudioElement>(null);
    const confettiSoundRef = useRef<HTMLAudioElement>(null);

    const methods = useForm<RouletteValues>({
        resolver: zodResolver(rouletteSchema),
    });

    const handleSubmit = (values: RouletteValues) => {
        setOptions([
            ...options,
            {
                id: crypto.randomUUID(),
                value: values.new_value,
            },
        ]);
        methods.reset();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);
    }, [options]);

    const drawOptions = (angle: number) => {
        if (!canvasRef.current) return;
        if (context) {
            const centerX = canvasRef.current.width / 2;
            const centerY = canvasRef.current.height / 2;
            const radius = Math.min(centerX, centerY) - 5;

            const angleStep = (2 * Math.PI) / options.length;

            options.forEach((option, index) => {
                const startAngle = index * angleStep + (angle * Math.PI) / 180;
                const endAngle = (index + 1) * angleStep + (angle * Math.PI) / 180;
                const midAngle = startAngle + (endAngle - startAngle) / 2;

                context.beginPath();
                context.moveTo(centerX, centerY);
                context.arc(centerX, centerY, radius, startAngle, endAngle);
                context.closePath();

                context.fillStyle = `hsl(${index * (360 / options.length)}, 70%, 50%)`;
                context.fill();

                context.fillStyle = "#ffffff";
                context.font = "12px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";
                const textX = centerX + (radius - 20) * Math.cos(midAngle);
                const textY = centerY + (radius - 20) * Math.sin(midAngle);

                context.translate(textX, textY);
                context.rotate(midAngle + Math.PI / 2);
                context.fillText(option.value, 0, 0);
                context.rotate(-midAngle - Math.PI / 2);
                context.translate(-textX, -textY);
            });
        }
    };

    const spinWheel = () => {
        setIsExploding(false);
        if (!isSpinning) {
            if (wheelSoundRef.current) wheelSoundRef.current.volume = 0.2;

            wheelSoundRef.current?.play();

            setIsSpinning(true);
            const startTime = performance.now();
            let timer = 1;

            timer = 1;
            const spinAnimation = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const angle = Math.random() * 360;

                if (elapsedTime >= 4000) {
                    setIsSpinning(false);
                    setIsExploding(true);
                    if (confettiSoundRef.current) confettiSoundRef.current.volume = 0.2;
                    confettiSoundRef.current?.play();

                    return;
                }

                drawOptions(angle);

                setTimeout(() => {
                    requestAnimationFrame(spinAnimation);
                    timer = timer < 50 ? timer + 1 : timer;
                }, timer);
            };

            requestAnimationFrame(spinAnimation);
        }
    };

    useEffect(() => {
        drawOptions(270);
    }, [options]);

    const ruletteOptions: {[key: number]: string} = {
        0: "Add two options to start!",
        1: "Add one more option to start!",
    };

    useEffect(() => {
        document.title = "Multigames | Roulette";
    }, []);

    return (
        <div className="relative flex flex-col h-full justify-center items-center gap-6">
            {isExploding && <ConfettiExplosion className="absolute top-14" height={1080} width={1920} />}
            <h2 className="font-bold text-center">Roulette</h2>
            <audio ref={wheelSoundRef} src="/wheelsound.mp3" />
            <audio ref={confettiSoundRef} src="/confettisound.mp3" />
            <div className="relative flex justify-center items-center h-full">
                <canvas
                    ref={canvasRef}
                    className={`rounded-full ${options.length === 0 ? "bg-neutral-700" : "bg-gray-200"}`}
                    height={350}
                    width={350}
                />

                <div className="absolute">
                    {ruletteOptions[options.length] ? (
                        <h2>{ruletteOptions[options.length]}</h2>
                    ) : (
                        <button
                            className="bg-gray-200 text-neutral-900 font-bold drop-shadow-md rounded-full p-2 h-16 w-16 hover:scale-95 transition-all active:scale-90"
                            onClick={spinWheel}
                        >
                            Spin!
                        </button>
                    )}
                </div>
                <div className="w-0 h-0 absolute top-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-gray-200 drop-shadow-lg border-r-[10px] border-r-transparent" />
            </div>

            <form className="flex flex-col gap-2" onSubmit={methods.handleSubmit(handleSubmit)}>
                <label className="flex flex-col">
                    <input
                        {...methods.register("new_value")}
                        autoFocus
                        autoComplete="off"
                        className={`bg-neutral-800 rounded-md outline-none px-2 py-1 border text-sm ${
                            methods.formState.errors.new_value
                                ? "placeholder:text-red-600 border-red-600 placeholder:text-xs"
                                : "placeholder:text-gray-200 border-neutral-700"
                        }`}
                        placeholder={`${
                            methods.formState.errors.new_value
                                ? methods.formState.errors.new_value.message
                                : "Add value"
                        }`}
                        type="text"
                    />
                </label>
                <button className="w-full bg-purple-900 rounded-md font-semibold hover:bg-purple-700">Add</button>
            </form>
            {options.length > 0 && (
                <Drawer>
                    <DrawerTrigger>
                        <i className="fa-regular fa-gear" />
                    </DrawerTrigger>
                    <DrawerContent>
                        <span className="w-full flex justify-end px-12">
                            <DrawerClose className="w-fit">
                                <i className="fa-regular fa-close" />
                            </DrawerClose>
                        </span>
                        <DrawerHeader className="flex flex-col gap-4 items-center justify-center">
                            <DrawerTitle>Options</DrawerTitle>
                            <DrawerDescription>Edit or remove options</DrawerDescription>
                        </DrawerHeader>
                        <DrawerDescription className="flex justify-center items-center flex-col gap-2 max-h-96 overflow-y-auto">
                            {options.map((option) => (
                                <div key={option.id} className="flex gap-2 items-center">
                                    <input
                                        className="bg-neutral-800 rounded-md outline-none px-2 py-1 border text-sm border-neutral-700 text-gray-300"
                                        type="text"
                                        value={option.value}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            const updatedOptions = options.map((opt) => {
                                                if (opt.id === option.id) {
                                                    return {...opt, value: newValue};
                                                }

                                                return opt;
                                            });

                                            setOptions(updatedOptions);
                                        }}
                                    />
                                    <i
                                        className="fa-regular fa-trash cursor-pointer hover:text-red-500 transition-all"
                                        onClick={() => setOptions(options.filter(({id}) => id !== option.id))}
                                    />
                                </div>
                            ))}
                        </DrawerDescription>
                        <DrawerFooter />
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
}
