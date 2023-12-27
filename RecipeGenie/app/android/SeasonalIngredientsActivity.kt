package android.recipegenie

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class SeasonalIngredientsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_seasonal_ingredients)
    }

    private fun getCurrentSeason(): String {
        if (month in 1..2 || month == 12) {
            return "Winter"
        } else if (month in 3..5) {
            return "Spring"
        } else if (month in 6..8) {
            return "Summer"
        } else if (month in 9..11) {
            return "Fall"
        }
        return "Spring"
    }
}