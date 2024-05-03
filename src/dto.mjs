const findMatches = (ordersIncidentsEvent, ordersIncidentsAccountTcc) => {
    // Create an object to store the matches
    const matches = {};

    // Iterate over the first array (ordersIncidentsEvent)
    ordersIncidentsEvent.forEach(event => {
        // Get the GuideId from the event
        const guideId = event.guideId;

        // Find matches in the second array (ordersIncidentsAccountTcc) based on numeroremesa
        const matchingAccounts = ordersIncidentsAccountTcc.filter(account => account.numeroremesa === guideId);

        // If there are matching accounts, find the one with the latest fechaplanteanovedad
        if (matchingAccounts.length > 0) {
            const latestAccount = matchingAccounts.reduce((latest, current) => {
                const latestDate = new Date(latest.fechaplanteanovedad);
                const currentDate = new Date(current.fechaplanteanovedad);
                return latestDate > currentDate ? latest : current;
            });

            // Add the match to the matches object, including additional fields from the first array
            matches[guideId] = {
                guideId: guideId,
                idnovedad: latestAccount.idnovedad,
                data: latestAccount,
                idOrder: event.idOrder,
                idCarrierStatusUpdate: event.idCarrierStatusUpdate
            };
        }
    });

    // Create an array to store the results
    const result = [];

    // Iterate over the keys of the matches object and push them into the result array
    for (const key in matches) {
        result.push(matches[key]);
    }

    // Return the result array
    return result;
}

export default  {findMatches}
