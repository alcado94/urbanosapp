var app = new Vue({
    el: '#app',
    data: {
        stopsList: [],
        stop: undefined,
        searchQuery: '',
        stopId: '',
        stopTime: undefined,
        stopSaved: undefined,
        loading: false
    },
    computed: {
        stopsResult: function(){
            if (this.searchQuery !== '') {
                this.stop = undefined
                return this.stopsList.filter((stop) => {
                    return stop.NombreParada.match(this.searchQuery)
                });
            } 
        }
    },
    mounted () {
        this.stopSaved = JSON.parse(localStorage.getItem("Paradas"));
        axios
            .get('https://murmuring-everglades-80238.herokuapp.com/api/stops')
            .then(response => this.stopsList = response.data )
    },
    methods: {
        selectStop(id) {
            this.stop = undefined
            this.loading = true;
            axios
                .get('https://murmuring-everglades-80238.herokuapp.com/api/stops/'+id)
                .then(response => {
                    this.loading = false;
                    this.stop = response.data 
                })
            //this.stopTime = [{"NumLinea":20, "NombreLinea":"test", "Tiempo": 30},{"NumLinea":20, "NombreLinea":"test", "Tiempo": 10}]
        },
        saveStop() {
            // COMPROBAR QUE NO SE INSERTE VALORES DUPLICADOS
            if (!this.stopSaved) this.stopSaved = {"Paradas":[]}
            
            this.stopSaved.Paradas.push({"NumParada":this.stopId,"NombreParada":this.stop.NombreParada})
            localStorage.setItem("Paradas", JSON.stringify(this.stopSaved))
        }
    }
})