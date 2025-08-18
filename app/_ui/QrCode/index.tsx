
// FIXME... just have a 2d array thing
interface QrCodeIface {
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

const iter = <T,>(n: number, f: (ii: number) => T) => {
    const array = new Array(n);
    for (let ii = 0; ii < n; ii += 1) {
        array[ii] = f(ii);
    }
    return array as T[];
};

const isPositionMarker = (count: number, ii: number, jj: number) => {
    // Upper left
    if (ii >= 2 && ii <= 4
        && jj >= 2 && jj <= 4) {
        return true;
    }
    // top right
    if (ii >= count - 5 && ii <= count - 3
        && jj >= 2 && jj <= 4) {
        return true;
    }
    // bottom left
    if (ii >= 2 && ii <= 4
        && jj >= count - 5 && jj <= count - 3) {
        return true;
    }
    return false;
};

interface Props {
    positionMarker?: string;
    qr: QrCodeIface;
}

const QrCode = ({ qr, positionMarker }: Props) => {
    const count = qr.getModuleCount();
    return <g>
           <g>
              {
                  iter(count, ii =>
                      iter(count, jj => {
                          if (isPositionMarker(count, ii, jj)) {
                              return;
                          }
                          if (!qr.isDark(ii, jj)) {
                              return;
                          }
                          return <rect key={`${ii}-${jj}`} x={ii} y={jj} width={1} height={1} />;
                      })
                  )
              }
           </g>
           <g>
               <image x={2} y={2} href={positionMarker} width={3} height={3} />
               <image x={count - 5} y={2} href={positionMarker} width={3} height={3} />
               <image x={2} y={count - 5} href={positionMarker} width={3} height={3} />
           </g>
        </g>;
};

export default QrCode;
