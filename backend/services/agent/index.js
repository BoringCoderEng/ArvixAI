import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/agent.route.js"



dotenv.config()

const port=process.env.PORT
const app=express()
app.use(express.json())



app.use("/",router)


app.use((err,req,res,next)=>{
    console.log(err)

    if(err.status){
        return res.status(err.status).json(err.data)
    }

    return res.status(500).json({message:`agent error ${err.message}`})
})


app.get("/",(req,res)=>{
    res.json({message:"hello from agent"})
})

app.listen(port,()=>{
    console.log(`Agent started at ${port}`)
    connectDB()
})



/*
1. Navigate to the ECS console in the eu-north-1 region
2. Go to the arvixai-backend cluster
3. Select the agent-service from the services list
4. Click on the Deployments tab to view the failed deployment details
5. Check the Events tab to identify specific failure reasons (such as task startup failures, health check failures, or resource constraints)
6. Click on the Tasks tab and filter by Stopped tasks to view recently failed tasks
7. Select a stopped task and review the Stopped reason and the Logs section to identify the root cause
8. Based on the failure reason, address one of the following common issues:
   - **If tasks are failing health checks**: Review the health check configuration in the target group (if using a load balancer) and ensure your application is responding correctly on the health check path and port
   - **If tasks are failing to start due to resource constraints**: Check the task definition resource requirements (CPU and memory) and verify the container instances or Fargate capacity can accommodate these requirements
   - **If tasks are failing due to application errors**: Review the CloudWatch Logs for the container to identify application startup issues or crashes
   - **If tasks are failing due to IAM permission issues**: Check the task execution role and task role have the necessary permissions for pulling images from ECR, writing to CloudWatch Logs, and accessing other required AWS services
   - **If tasks are failing to pull container images**: Verify the image URI in the task definition is correct and the task execution role has permissions to pull from the ECR repository
9. After identifying and fixing the root cause, create a new deployment or update the service to trigger a new deployment
10. Monitor the new deployment in the Events and Deployments tabs to ensure tasks reach a healthy state
11. If the Deployment Circuit Breaker continues to trigger, review the circuit breaker configuration (failure threshold and rollback settings) in the service deployment configuration settings to ensure it aligns with your application startup time requirements
*/