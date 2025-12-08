import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setRError } from '../redux/pointsSlice';

const SVG_SIZE = 300;
const AXIS_OFFSET = SVG_SIZE / 2; // 150
const R_SCALE = 100; // 100 пикселей = 1 R

const Graph = () => {
    const dispatch = useDispatch();
    const { items: points, currentR } = useSelector((state) => state.points);

    const isRValid = !isNaN(currentR) && currentR >= 1 && currentR <= 4;

    const handleClick = (e) => {
        if (!isRValid) {
            dispatch(setRError("Выберите корректный R (1...4) для добавления точки!"));
            return;
        }

        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const svgX = clickX - AXIS_OFFSET;
        const svgY = AXIS_OFFSET - clickY;

        const mathX = (svgX / R_SCALE) * currentR;
        const mathY = (svgY / R_SCALE) * currentR;

        dispatch(addPoint({
            x: mathX.toFixed(3),
            y: mathY.toFixed(3),
            r: currentR
        }));
    };

    return (
        <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            onClick={handleClick}
            style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                cursor: isRValid ? 'crosshair' : 'not-allowed',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
        >
            <line x1="0" y1={AXIS_OFFSET} x2={SVG_SIZE} y2={AXIS_OFFSET} stroke="#334155" strokeWidth="2" />
            <line x1={AXIS_OFFSET} y1="0" x2={AXIS_OFFSET} y2={SVG_SIZE} stroke="#334155" strokeWidth="2" />
            <polygon points={`${SVG_SIZE},${AXIS_OFFSET} ${SVG_SIZE-10},${AXIS_OFFSET-5} ${SVG_SIZE-10},${AXIS_OFFSET+5}`} fill="#334155"/>
            <polygon points={`${AXIS_OFFSET},0 ${AXIS_OFFSET-5},10 ${AXIS_OFFSET+5},10`} fill="#334155"/>

            <g transform={`translate(${AXIS_OFFSET}, ${AXIS_OFFSET}) scale(1, -1)`}>
                <polygon points={`0,0 ${-R_SCALE/2},0 ${-R_SCALE/2},${R_SCALE} 0,${R_SCALE}`} fill="#3b82f6" fillOpacity="0.5" />

                <path
                    d={`M 0 0 L 0 ${R_SCALE/2} A ${R_SCALE/2} ${R_SCALE/2} 0 0 0 ${R_SCALE/2} 0 Z`}
                    fill="#3b82f6"
                    fillOpacity="0.5"
                />
                <polygon points={`0,0 ${R_SCALE},0 0,${-R_SCALE}`} fill="#3b82f6" fillOpacity="0.5" />
            </g>


            <text x={AXIS_OFFSET + R_SCALE} y={AXIS_OFFSET + 15} textAnchor="middle" fontSize="10">R</text>
            <text x={AXIS_OFFSET + R_SCALE/2} y={AXIS_OFFSET + 15} textAnchor="middle" fontSize="10">R/2</text>
            <text x={AXIS_OFFSET - R_SCALE} y={AXIS_OFFSET + 15} textAnchor="middle" fontSize="10">-R</text>
            <text x={AXIS_OFFSET - R_SCALE/2} y={AXIS_OFFSET + 15} textAnchor="middle" fontSize="10">-R/2</text>

            <text x={AXIS_OFFSET + 5} y={AXIS_OFFSET - R_SCALE} fontSize="10" dominantBaseline="middle">R</text>
            <text x={AXIS_OFFSET + 5} y={AXIS_OFFSET - R_SCALE/2} fontSize="10" dominantBaseline="middle">R/2</text>
            <text x={AXIS_OFFSET + 5} y={AXIS_OFFSET + R_SCALE} fontSize="10" dominantBaseline="middle">-R</text>
            <text x={AXIS_OFFSET + 5} y={AXIS_OFFSET + R_SCALE/2} fontSize="10" dominantBaseline="middle">-R/2</text>


            {isRValid && points.map((p, index) => {
                const cx = AXIS_OFFSET + (p.x / currentR) * R_SCALE;
                const cy = AXIS_OFFSET - (p.y / currentR) * R_SCALE;

                return (
                    <circle
                        key={p.id || index}
                        cx={cx}
                        cy={cy}
                        r="4"
                        fill={p.hit ? '#10b981' : '#ef4444'}
                        stroke="#fff"
                        strokeWidth="1.5"
                    />
                );
            })}
        </svg>
    );
};

export default Graph;