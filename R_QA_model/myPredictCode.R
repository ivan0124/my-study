
#load trained model
load("model.RData")
exp(train.result$coef)

confint(train.result)

exp(confint(train.result))

test_data =read.table("./test_data.txt", header =T)
pred = predict(train.result, newdata =test_data, type ="response")
for(j in 1:nrow(test_data)) {

  if (pred[j] <=0.385){
    pred[j]=0
    cat("===> predict result = GOOD.\n")
  } 
  else{
    pred[j]=1
    cat("===> predict result = FAIL.\n")
  }
}
