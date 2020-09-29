import java.util.*;

class Main {

	public static int shopperDelightDpTwoDimension (int budget, int[] priceOfJeans, int[] priceOfShoes, int[] priceOfSkirts, int[] priceOfTops) {
		
		int[][] dp = new int[4][budget + 1];
		HashMap<Integer, int[]> map = new HashMap <>();
		
		map.put (1, priceOfShoes);
		map.put (2, priceOfSkirts);
		map.put (3, priceOfTops);
		
		for (int i = 0; i < priceOfJeans.length; i++) {
			dp[0][priceOfJeans[i]] = 1;
		}

		for (int i = 1; i < dp.length; i++) {
			for (int j = 1; j <= budget; j++) {
				if (dp[i - 1][j] != 0) {
					for (int price = 0; price < map.get (i).length; price++) {
						if (j + map.get (i)[price] <= budget) {
							dp[i][j + map.get (i)[price]] += dp[i - 1][j];
						}
					}
				}
			}
		}
		
		int ans = 0;
		
		for (int i = 1; i <= budget; i++) {
			ans += dp[3][i];
		}
		
		return ans;
	}

	public static int shopperDelightDpOneDimension (int budget, int[] priceOfJeans, int[] priceOfShoes, int[] priceOfSkirts, int[] priceOfTops) {

		int[] dp = new int[budget + 1];
		HashMap<Integer, int[]> map = new HashMap <>();
		
		map.put (1, priceOfShoes);
		map.put (2, priceOfSkirts);
		map.put (3, priceOfTops);
		
		for (int i = 0; i < priceOfJeans.length; i++) {
			dp[priceOfJeans[i]] = 1;
		}

		for (int i = 1; i < 4; i++) {
            int[] nextDp = new int[budget + 1];
			for (int j = 1; j <= budget; j++) {
				if (dp[j] != 0) {
					for (int price = 0; price < map.get (i).length; price++) {
						if (j + map.get(i)[price] <= budget) {
							nextDp[j + map.get (i)[price]] += dp[j];
						}
					}
				}
			}
            dp = nextDp;
		}

		int ans = 0;
		
		for (int i = 1; i <= budget; i++) {
			ans += dp[i];
		}

		return ans;
	}

  public static void main(String[] args) {
      int[] jeans1 = {2, 3}, shoes1 = {4}, skirts1 = {2,3}, tops1 = {1, 2};
      int k1 = 10;
      int[] jeans2 = {2, 3}, shoes2 = {4}, skirts2 = {2}, tops2 = {1, 2, 3};
      int k2 = 10;
      int[] jeans3 = {4}, shoes3 = {3, 4, 1}, skirts3 = {3, 2}, tops3 = {4};
      int k3 = 12;
      int[] jeans4 = {1}, shoes4 = {4}, skirts4 = {3}, tops4 = {1};
      int k4 = 3;
      System.out.println(shopperDelightDpTwoDimension(k1, jeans1, shoes1, skirts1, tops1)); // 4
      System.out.println(shopperDelightDpTwoDimension(k2, jeans2, shoes2, skirts2, tops2)); // 3
      System.out.println(shopperDelightDpTwoDimension(k3, jeans3, shoes3, skirts3, tops3)); // 2
      System.out.println(shopperDelightDpTwoDimension(k4, jeans4, shoes4, skirts4, tops4)); // 0
  }
}