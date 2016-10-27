
#load trained model
load("model.RData")
#exp(train.result$coef)

#confint(train.result)

#exp(confint(train.result))

test_data =read.table("./test_data.txt", header =T)
cut_value_file =read.table("./cut_value.txt", header =T)

#print(names(cut_value_file))
#cat("title name  = ", names(cut_value_file)[1], "\n")
#cat("cut_value_file$cut_value[1] = ", cut_value_file$cut_value[1], "\n")
threshold = cut_value_file$cut_value[1];
cat("threshold = ", threshold, "\n")

pred = predict(train.result, newdata =test_data, type ="response")
for(j in 1:nrow(test_data)) {

  if (pred[j] <= threshold){
    pred[j]=0
    cat("===> predict result = GOOD.\n")
  } 
  else{
    pred[j]=1
    cat("===> predict result = FAIL.\n")
  }
}
