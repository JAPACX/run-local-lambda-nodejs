const findMatches = (ordersIncidentsEvent, ordersIncidentsAccountTcc) => {
    const matches = {};

    ordersIncidentsEvent.forEach(event => {
        const guideId = event.guideId;

        const matchingAccounts = ordersIncidentsAccountTcc.filter(account => account.numeroremesa === guideId);

        if (matchingAccounts.length > 0) {
            const latestAccount = matchingAccounts.reduce((latest, current) => {
                const latestDate = new Date(latest.fechaplanteanovedad);
                const currentDate = new Date(current.fechaplanteanovedad);
                return latestDate > currentDate ? latest : current;
            });

            matches[guideId] = {
                guideId: guideId,
                idnovedad: latestAccount.idnovedad,
                data: latestAccount,
                idOrder: event.idOrder,
                idCarrierStatusUpdate: event.idCarrierStatusUpdate
            };
        }
    });

    const result = [];

    for (const key in matches) {
        result.push(matches[key]);
    }

    return result;
}

export default  {findMatches}
