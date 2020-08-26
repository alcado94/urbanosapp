var app = new Vue({
    el: '#app',
    data: {
        stopsList: [],
        stop: undefined,
        searchQuery: '',
        stopId: '',
        stopName: '',
        stopTime: undefined,
        stopSaved: undefined,
        loading: false
    },
    computed: {
        stopsResult: function(){
            if (this.searchQuery !== '') {
                this.stop = undefined
                return this.stopsList.filter((stop) => {
                    return stop.NumParada == this.searchQuery || 
                        stop.NombreParada.toLowerCase().match(this.searchQuery.toLowerCase())
                });
            } 
        }
    },
    mounted () {
        this.stopSaved = JSON.parse(localStorage.getItem("Paradas"));
        axios
            .get('https://urbanosou.herokuapp.com/api/stops')
            .then(response => this.stopsList = response.data )
    },
    methods: {
        selectStop(id, name, sentido) {
            this.stop = undefined
            this.loading = true;
            this.stopName = name + ' - ' + sentido;
            axios
                .get('https://urbanosou.herokuapp.com/api/stops/'+id)
                .then(response => {
                    this.loading = false;
                    this.stop = response.data 
                });
        },
        saveStop() {
            // COMPROBAR QUE NO SE INSERTE VALORES DUPLICADOS
            if (!this.stopSaved) this.stopSaved = {"Paradas":[]}
            
            this.stopSaved.Paradas.push({"NumParada":this.stopId,"NombreParada":this.stop.NombreParada})
            localStorage.setItem("Paradas", JSON.stringify(this.stopSaved))
        }
    }
})