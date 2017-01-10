#include <stdio.h>
#include <math.h>
#include <float.h>

int hddPredict(int size, int smartList[]) {
    const double x_max = -log(DBL_EPSILON);
    double x = 0, p_cal = 1.0;
    double th = 0.385; //threshold to classify the prediction
    double coef[] = {-1.667, 0.009144, 0.00001238, 1.417, -0.00009659, 0.7102}; //coefficient for logistic regression
    //-1.667e+00      9.144e-03      1.238e-05      1.417e+00     -9.659e-05      7.102e-01
    int i;
    
    for (i = 0; i < size; i++) {
        x += coef[i] * smartList[i];
    }

    printf("x : %1f, x_max : %1f\n", x, x_max);

    if (x > x_max)
        return 1;
    else {
        p_cal = exp(x)/(1 + exp(x));
        if (p_cal > th)
            return 1;
        else
            return 0;
    }
}

