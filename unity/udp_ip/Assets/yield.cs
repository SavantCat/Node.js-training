using UnityEngine;
using System.Collections;

public class yield : MonoBehaviour {

	// Use this for initialization
	void Start () {
		StartCoroutine("Test");
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	private IEnumerator Test()
	{
		while(true){
			yield return new WaitForSeconds(1);
			Debug.Log ("test");
			//StartCoroutine("Test");
		}
	}

}
