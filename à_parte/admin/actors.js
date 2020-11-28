const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true

window.onload = () => {
    // References to HTML objects   
    const tblActors = document.getElementById("tblActors")
    const frmActor = document.getElementById("frmActor")


    frmActor.addEventListener("submit", async(event) => {
        event.preventDefault()
        const txtName = document.getElementById("txtName").value
        const txtJob = document.getElementById("txtJob").value
        const txtPhoto = document.getElementById("txtPhoto").value
        const txtFacebook = document.getElementById("txtFacebook").value
        const txtTwitter = document.getElementById("txtTwitter").value
        const txtLinkedin = document.getElementById("txtLinkedin").value
        const txtBio = document.getElementById("txtBio").value
        const txtActorId = document.getElementById("txtActorId").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um orador
        let response
        if (isNew) {
            // Adiciona Orador
            response = await fetch(`${urlBase}/actors`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            })
            const newActorId = response.headers.get("Location")
            const newActor = await response.json()
                // Associa orador à conferência WebConfernce
            const newUrl = `${urlBase}/conferences/1/actors/${newActorId}`
            const response2 = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            const newActor2 = await response2.json()
        } else {
            // Atualiza Orador
            response = await fetch(`${urlBase}/actors/${txtActorId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            })

            const newActor = await response.json()
        }
        isNew = true
        renderActors()
    })



    const renderActors = async() => {
        frmActor.reset()
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Oradores</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome</th>
                    <th class='w-38'>Cargo</th>              
                    <th class='w-10'>Foto</th>              
                </tr> 
            </thead><tbody>
        `
        const response = await fetch(`${urlBase}hollywood/1/actors`)
        const actors = await response.json()
        let i = 1
        for (const actor of actors) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${actor.nome}</td>
                    <td>${actor.cargo}</td>
                    <td>
                        <i id='${actor.idActor}' class='fas fa-edit edit'></i>
                        <i id='${actor.idActor}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblActor.innerHTML = strHtml

        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const actor of actors) {
                    if (actor.idActor == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtActorId").value = actor.idActor
                        document.getElementById("txtName").value = actor.nome
                        document.getElementById("txtJob").value = actor.cargo
                        document.getElementById("txtPhoto").value = actor.foto
                        document.getElementById("txtFacebook").value = actor.facebook
                        document.getElementById("txtTwitter").value = actor.twitter
                        document.getElementById("txtLinkedin").value = actor.linkedin
                        document.getElementById("txtBio").value = actor.bio
                    }
                }
            })
        }

        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
                swal({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                }).then(async(result) => {
                    if (result.value) {
                        let actorId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${urlBase}/conferences/1/actors/${actorId}`, {
                                method: "DELETE"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O orador foi removido da Conferência.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderActors()
                    }
                })
            })
        }
    }
    renderActors()
}