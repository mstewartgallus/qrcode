const FilterMonochrome = () =>
    <>
        <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.099 0.195 0.038 0 0
                    0.099 0.195 0.038 0 0
                    0.099 0.195 0.038 0 0
                    0     0     0     1 0" />
        <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
        </feComponentTransfer>
    </>;

export default FilterMonochrome;
