PROGAMMER's STYLE GUIDE
==================================================

Don't use abreviations.

Use spaces! Use spaces on the right place. Expamples are in the source itself.

    if (field)
    {
    	if (field .getAccessType () === X3DConstants .inputOutput)
    	{
    		delete this ._fields ["set_" + field .getName ()];
    		delete this ._fields [field .getName () + "_changed"];
    	}
    
    	delete this ._fields [name];
    	delete this ._userDefinedFields [name];
    
    	var fieldDefinitions = this .fieldDefinitions .getValue ();
    
    	for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
    	{
    		if (fieldDefinitions [i] .name === name)
    		{
    			fieldDefinitions .splice (i, 1);
    			break;
    		}
    	}
    
    	if (! this .getPrivate ())
    		field .removeClones (1);
    }

Use newlines! Use newlines after var declarations, if, for, while, do loops!

Group declarations together.

Comment code if needed! Don't comment code if the code is self explanatory. Write self explanatory code.