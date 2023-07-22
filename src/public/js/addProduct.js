const addLink = async (_id) => {
    try {
        const cart = "64aeb5dab4b5c77a43a97fdb"
        const res = await fetch(`/api/carts/${cart}/product/${_id}`, {
            method: "POST", // ruta post de la api
        })
        const result = await res.json()
        if (result.status === "error") throw new Error(result.error) //si el json, que ahora esta
        //  dentro de la const result, da error en su status, me tira un nuevo error y throw detiene la
        // ejecucion siguiente 
    } catch (error) {
        console.log(error)
    }
}
