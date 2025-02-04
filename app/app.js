App = {
    loading: false,
    contracts: {},

    load: async ()=> {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async ()=> {
        if(window.ethereum){
            App.web3Provider = window.ethereum
        }
    },    

    loadAccount: async ()=> {
        App.account = await ethereum.request({ method: 'eth_accounts' });
    },

    loadContract: async ()=> {
        const daftarTugas = await $.getJSON('Penugasan.json')
        App.contracts.DaftarTugas = TruffleContract(daftarTugas)
        App.contracts.DaftarTugas.setProvider(App.web3Provider)
        App.daftarTugas = await App.contracts.DaftarTugas.deployed()        
    },

    render: async ()=> {    
        if(App.loading){
            return
        }    
        App.setLoading(true)

        $('#account').html(App.account[0])

        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async () => {
        const jumlahTugas = await App.daftarTugas.jumlahTugas();
        const $taskTemplate = $(".taskTemplate");
    
        console.log("Jumlah tugas:", jumlahTugas.toNumber());
        
    
        for (var i = 1; i <= jumlahTugas; i++) {
            const tugas = await App.daftarTugas.daftarTugas(i);
            
            const taskId = tugas.id.toNumber();  // Konversi BN ke angka
            const taskContent = tugas.isiTugas;
            const taskCompleted = tugas.isSelesai;
            const taskOwner = tugas.owner;
    
            console.log("Tugas:", taskId, taskContent, taskCompleted, taskOwner);
    
            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find(".content").html(taskContent + " (" + taskOwner + ")");
            $newTaskTemplate.find("input")
                .prop("name", taskId)
                .prop("checked", taskCompleted)
                .on("click", App.toggleCompleted);
    
            if (taskCompleted) {
                $("#completedTaskList").append($newTaskTemplate);
            } else {
                if (taskOwner === "Orang 1") {
                    $("#taskListOrang1").append($newTaskTemplate);
                } else if (taskOwner === "Orang 2") {
                    $("#taskListOrang2").append($newTaskTemplate);
                }
            }
            $newTaskTemplate.show();
            console.log("Menampilkan tugas untuk:", taskOwner);

        }
    },
    

    createTask: async () => {
        App.setLoading(true)
        const content1 = $('#newTask1').val()
        const content2 = $('#newTask2').val()

        if (content1 || content2) {
            if (content1) {
                await App.daftarTugas.buatTugas(content1, "Orang 1", {from:App.account[0]})
            }
            if (content2) {
                await App.daftarTugas.buatTugas(content2, "Orang 2", {from:App.account[0]})
            }
        }
        
        window.location.reload()
    },
    
    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskId = e.target.name
        await App.daftarTugas.tugasSelesai(taskId, {from:App.account[0]})
        window.location.reload()
    },
    
    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
    }
}

$(document).ready(function(){
    App.load()
    
    ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()        
    });        
})