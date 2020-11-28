const urlBase = "https://fcawebbook.herokuapp.com"




window.onload = () => {
    // References to HTML objects   
    const btnUser = document.getElementById("btnUser")
    const tblUsers = document.getElementById("tblUsers")

    const renderUsers = async() => {

        let strHtml = `
        <thead >
            <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Participantes</th></tr>
            <tr class='bg-info'>
                <th class='w-2'>#</th>
                <th class='w-50'>Nome</th>
                <th class='w-38'>E-mail</th>              
                <th class='w-10'>Ações</th>              
            </tr> 
        </thead><tbody>
    `
        const response = await fetch(`${urlBase}/hollywood/1/users`)
        const users = await response.json()
        let i = 1
        for (const user of users) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${user.nomeUser}</td>
                    <td>${user.idUser}</td>
                    <td><i id='${user.idUser}' class='fas fa-trash-alt remove'></i></td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblUsers.innerHTML = strHtml


        // Manage click delete        
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
                        let userId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${urlBase}/hollywood/1/users/${userId}`, { method: "DELETE" })
                            const users = await response.json()
                            swal('Removido!', 'O utilizador foi removido da Hollywood.', 'success')
                            renderUsers()
                        } catch (err) {
                            swal({ type: 'error', title: 'Erro', text: err })
                        }
                    }
                })
            })
        }
    }
    renderUsers()
}