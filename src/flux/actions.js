export const VIEW_SLOTS = `VIEW_SLOTS`;
export const NOMINATE_ON_SLOTS=`NOMINATE_ON_SLOTS`;
export const GET_MONTH_SLOTS=`GET_MONTH_SLOTS`;
export const UPDATE_SLOT_INFO=`UPDATE_SLOT_INFO`;

class Actions{
    constructor(){
       
    }
    viewSlotsAction(data){
        return{
            type:VIEW_SLOTS,
            data:{}
        }
    }
    viewSlotsActionResponse(data){
        return $.ajax({
            url:"http://localhost:4000/DatewiseSlots/1",
            method:'get',
            contentType:"application/json",
        });
    }

    nominateOnSlotsAction(data){
        return{
            type:NOMINATE_ON_SLOTS,
            data:data
        }
    }
    getMonthSlotsActionResponse(data){
        return $.ajax({
            url:"http://localhost:3000/CalendarView/1",
            method:'get',
            contentType:"application/json",
        });
    }

    getMonthSlotsAction(data){
        let action={
            type:GET_MONTH_SLOTS,
            data:{},
        }
        return action;
    }
   updateSlotInformationAction(data){
        return {
            type : UPDATE_SLOT_INFO,
            data : data
        }
    }
    getUpdatedSlotInfoResponse(data){
        return $.ajax({
            url:"http://localhost:4000/DatewiseSlots/1",
            contentType:"application/json",
            method:'put',
            data:JSON.stringify(data), 
        });
    }
}
export const actionObj=new Actions();