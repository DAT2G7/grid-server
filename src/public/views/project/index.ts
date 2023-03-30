function deleteCore(coreID: string) {
    fetch("/api/project/core" + coreID, {
        method: "DELETE"
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => console.log(err));
}
