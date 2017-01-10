
#load trained model
load("Model.RData")
#exp(train.result$coef)

#confint(train.result)

#exp(confint(train.result))

feature_data =read.table("./Feature.data", header =T)
cut_value_file =read.table("./Threshold.data", header =T)

#print(names(cut_value_file))
#cat("title name  = ", names(cut_value_file)[1], "\n")
#cat("cut_value_file$cut_value[1] = ", cut_value_file$cut_value[1], "\n")
threshold = cut_value_file$cut_value[1];
#cat("threshold = ", threshold, "\n")

pred = predict(model.logi, newdata =feature_data, type ="response")
for(j in 1:nrow(feature_data)) {

  if (pred[j] <= threshold){
    pred[j]=0
    cat("{\"Prediction\":{\"Health\" : 0, \"Model Accuracy\": \"83%\", \"Model version\" : \"v0.0.7\" }}")
  } 
  else{
    pred[j]=1
    cat("{\"Prediction\":{\"Health\" : 1, \"Model Accuracy\": \"83%\", \"Model version\" : \"v0.0.7\" }}")
  }
}
