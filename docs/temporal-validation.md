# Temporal research validation

The selected portable MA research module uses a declared four-parameter grid, a 60/20/20 chronological train/validation/test split, and 252-session training / 63-session nonoverlapping test folds. Parameters are selected only on prior training results, then frozen. Each segment starts flat and liquidates at its end, accounting for costs at boundaries. Signals use completed prior bars; the caller supplies a separately validated next-open simulator.

This public module is an educational baseline, not an unpublished strategy or the internal backtest engine. Changing unseen future prices must not affect earlier parameter choices or folds. Synthetic fixture tests demonstrate this invariant. Adjusted history is not a point-in-time constituent database; survivorship bias, revised corporate actions, repeated researcher choices and estimated historical spreads remain limitations. Returns are not evidence of live profitability.
