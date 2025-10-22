<template>
    <div class="w-80">
        <Line v-if="chartData && chartData.datasets && chartData.datasets.length > 0"
            id="league-table-chart"
            :options="chartOptions"
            :data="chartData"
        />
    </div>
</template>
<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
export default {
    name: "LeagueTableChart",
    components: {
      Line
    },
    props:{
      fixturesData: Array,
      rules: Array,
    },
    mounted() {
        console.log('fixtures data pre [0]',this.fixturesData[0]);
        var fixturesDetails = this.fixturesData.filter(a => a.fixture != null).sort((a, b) => this.rules.find(r => r.id === a.fixture)?.order - this.rules.find(r => r.id === b.fixture)?.order);
        const fixtures = this.rules.filter(a => a.id != null).sort((a, b) => a.order - b.order);
        console.log('fixtures data [0]',fixtures[0]);
        const labels = fixtures.map(a => a.title);

        // Zbierz unikalnych uczestników
        const usersMap = new Map();

        fixturesDetails.forEach((fixture, roundIndex) => {
            fixture.participants.forEach((p) => {
            const userId = p.userId;
            const userLabel = p.userLogin;
            const points = p.userTeam?.totalPoints ?? 0;

            if (!usersMap.has(userId)) {
                usersMap.set(userId, {
                id: userId,
                label: userLabel,
                data: [],
                borderColor: this.colors[usersMap.size % this.colors.length],
                });
            }
            
            usersMap.get(userId).data.push(points);
            });
        });
        console.log('users map',usersMap);
        console.log('users map values',usersMap.values());
        // Make it cumulative sum
        usersMap.forEach((userData) => {
            for (let i = 1; i < userData.data.length; i++) {
                if(userData.data[i] == null) userData.data[i] = 0;
                userData.data[i] += userData.data[i - 1];
            }
        });
        this.chartData.datasets = Array.from(usersMap.values());
        this.chartData.labels = labels;
       
    },
    data() {
      return {
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        chartData: {
          
        },
        chartOptions: {
          type: Object,
          default: () => {}
        }
      }
    }
}
</script>