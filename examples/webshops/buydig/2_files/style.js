/*
Please refer to readme.html for full Instructions

Text[...]=[title,text]

Style[...]=[TitleColor,TextColor,TitleBgColor,TextBgColor,TitleBgImag,TextBgImag,TitleTextAlign,TextTextAlign, TitleFontFace, TextFontFace, TipPosition, StickyStyle, TitleFontSize, TextFontSize, Width, Height, BorderSize, PadTextArea, CoordinateX , CoordinateY, TransitionNumber, TransitionDuration, TransparencyLevel ,ShadowType, ShadowColor]
*/

var FiltersEnabled = 0 // if your not going to use transitions or filters in any of the tips set this to 0

Text[0]=["Me Email","Click here to send me an email "]
Text[1]=["Home Page","Click here to go to my Web site."]
Text[2]=["This is the title","Well How do you find this Tip message to be?"]
Text[3]=["Right","This tip Is right positioned"]
Text[4]=["Center","This tip Is center positioned"]
Text[5]=["Left","This tip Is left positioned"]
Text[6]=["Float","This tip Is float positioned at a (10,10) coordinate, It also floats with the scrollbars so it is always static"]
Text[7]=["Fixed","This tip Is fixed positioned at a (1,1) coordinate"]
Text[8]=["sticky style","This tip will sticky around<BR>This is useful when you want to insert a link like this <A href='http://migoicons.tripod.com'>Home Page</A>"]
Text[9]=["keep style","This sticks around the mouse"]
Text[10]=["BuyDig.com","Add this product to your shopping cart for today's price"]
Text[11]=["Top coordinate control","This tip is right positioned with a 50 Y coordinate"]
Text[12]=["Visual effects","This tip has a Shadow and is Transparent a little and also has a random Transition applied to it "]
Text[13]=["different style","Wow this is a new style and position! "]
Text[14]=["This is The title","this is the text"]
Text[15]=["","This is only text"]
Text[16]=["","Some Lists <li>list one</li> <li>list two</li> <li>list three</li> <li>list four</li>"]


Style[0]=["white","black","#000099","#E8E8FF","","","","","","","","","","",200,"",2,2,10,10,51,1,0,"",""]
Style[1]=["white","black","#000099","#E8E8FF","","","","","","","center","","","",200,"",2,2,10,10,"","","","",""]
Style[2]=["white","black","#000099","#E8E8FF","","","","","","","left","","","",200,"",2,2,10,10,"","","","",""]
Style[3]=["white","black","#000099","#E8E8FF","","","","","","","float","","","",200,"",2,2,10,10,"","","","",""]
Style[4]=["white","black","#000099","#E8E8FF","","","","","","","fixed","","","",200,"",2,2,1,1,"","","","",""]
Style[5]=["white","black","#000099","#E8E8FF","","","","","","","","sticky","","",200,"",2,2,10,10,"","","","",""]
Style[6]=["white","black","#000099","#E8E8FF","","","","","","","","keep","","",200,"",2,2,10,10,"","","","",""]
Style[7]=["white","black","#FF9900","#FFEDB3","","","","","","","","","","",200,"",2,2,10,20,"","","25","",""]
Style[8]=["white","black","#96C3F5","#EFF4F9","","","","","","","","","","",200,"",2,2,10,20,"","","50","",""]
Style[9]=["white","black","#000099","#E8E8FF","","","","","","","","","","",200,"",2,2,10,10,51,0.5,75,"simple","gray"]
Style[10]=["white","black","black","white","","","right","","Impact","cursive","center","",3,5,200,150,5,20,10,0,50,1,80,"complex","gray"]
Style[11]=["white","black","#000099","#E8E8FF","","","","","","","","","","",200,"",2,2,10,10,51,0.5,45,"simple","gray"]
Style[12]=["white","black","#000099","#E8E8FF","","","","","","","","","","",200,"",2,2,10,10,"","","","",""]

applyCssFilter()

