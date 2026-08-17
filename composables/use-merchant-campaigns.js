import { computed, ref } from 'vue'

const STORAGE_KEY = 'merchant-campaigns-v1'
const seed = [
  { id:'P001',name:'独家社交双人套餐',status:'online',price:198,originalPrice:288,platformRate:10,agentRate:5,partnerRate:8,dailyStock:24,views:412,sales:86,badge:'HOT',theme:'dinner',images:[],items:[{name:'炭烤西冷牛排',quantity:2,price:98},{name:'田园沙拉',quantity:1,price:38},{name:'双人饮品',quantity:2,price:27}] },
  { id:'P002',name:'精致和风 · 双人寿司社交套餐',status:'online',price:298,originalPrice:388,platformRate:10,agentRate:5,partnerRate:6,dailyStock:15,views:280,sales:52,badge:'HOT',theme:'sushi',images:[],items:[{name:'主厨寿司拼盘',quantity:1,price:188},{name:'刺身双拼',quantity:1,price:120},{name:'味噌汤',quantity:2,price:20}] },
  { id:'P003',name:'热辣午夜 · 肆意撸串双人聚会',status:'offline',price:158,originalPrice:198,platformRate:10,agentRate:5,partnerRate:8,dailyStock:42,views:560,sales:103,badge:'NEW',theme:'grill',images:[],items:[{name:'招牌烤串组合',quantity:1,price:128},{name:'冰爽饮品',quantity:2,price:15}] },
  { id:'P004',name:'社交周三 · 甜品双人餐',status:'reviewing',price:98,originalPrice:158,platformRate:10,agentRate:5,partnerRate:5,dailyStock:20,views:0,sales:0,badge:'NEW',theme:'dessert',images:[],items:[{name:'手作甜点拼盘',quantity:1,price:98},{name:'精品咖啡',quantity:2,price:30}] },
  { id:'P005',name:'海鲜大咖 · 四人社交盛宴',status:'rejected',price:388,originalPrice:598,platformRate:10,agentRate:5,partnerRate:8,dailyStock:10,views:0,sales:0,badge:'',theme:'seafood',images:[],rejectionReason:'套餐内容描述不符合规范要求，请检查菜品明细与价格比例。',items:[{name:'海鲜拼盘',quantity:1,price:328},{name:'时蔬小炒',quantity:2,price:45}] }
]
function clone(v){return JSON.parse(JSON.stringify(v))}
function load(){const value=uni.getStorageSync(STORAGE_KEY);return Array.isArray(value)&&value.length?value:clone(seed)}
const campaigns=ref(load())
function persist(){uni.setStorageSync(STORAGE_KEY,clone(campaigns.value))}

export const campaignStatusMeta={online:{label:'已上架',tone:'online'},offline:{label:'已下架',tone:'offline'},reviewing:{label:'审核中',tone:'reviewing'},rejected:{label:'未通过',tone:'rejected'},draft:{label:'草稿',tone:'draft'}}
export function createCampaignDraft(){return{id:'',name:'',status:'draft',price:0,originalPrice:0,platformRate:10,agentRate:5,partnerRate:0,dailyStock:1,views:0,sales:0,badge:'NEW',theme:'dinner',images:[],items:[]}}
export function useMerchantCampaigns(){
  const counts=computed(()=>({all:campaigns.value.length,offline:campaigns.value.filter(v=>v.status==='offline').length,reviewing:campaigns.value.filter(v=>v.status==='reviewing').length,rejected:campaigns.value.filter(v=>v.status==='rejected').length}))
  function getCampaign(id){return campaigns.value.find(v=>v.id===id)||null}
  function saveCampaign(value,{publish=false}={}){const data=clone(value);data.id=data.id||`P${Date.now().toString().slice(-8)}`;data.status=publish?'reviewing':(data.status==='online'||data.status==='offline'?data.status:'draft');data.updatedAt=new Date().toISOString();const index=campaigns.value.findIndex(v=>v.id===data.id);if(index>=0)campaigns.value[index]=data;else campaigns.value.unshift(data);persist();return data}
  function setStatus(id,status){const item=getCampaign(id);if(!item)return false;item.status=status;persist();return true}
  function deleteCampaign(id){campaigns.value=campaigns.value.filter(v=>v.id!==id);persist()}
  return{campaigns,counts,getCampaign,saveCampaign,setStatus,deleteCampaign}
}
