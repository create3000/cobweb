
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Prototype/X3DProtoDeclarationNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DUrlObject,
          X3DProtoDeclarationNode, 
          X3DConstants)
{
"use strict";

	var fieldDefinitions = [
		new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
	];

	function X3DExternProtoDeclaration (executionContext)
	{
		this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

		X3DProtoDeclarationNode .call (this, executionContext .getBrowser (), executionContext);
		X3DUrlObject            .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .X3DExternProtoDeclaration);

		this .addChildren ("url", new Fields .MFString ());

		this .callbacks = [ ];
	}

	X3DExternProtoDeclaration .prototype = $.extend (Object .create (X3DProtoDeclarationNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: X3DExternProtoDeclaration,
		getTypeName: function ()
		{
			return "EXTERNPROTO";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "externprotos";
		},
		initialize: function ()
		{
			X3DProtoDeclarationNode .prototype .initialize .call (this);
			X3DUrlObject            .prototype .initialize .call (this);
				
			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");
		},
		set_live__: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE)
			{
				var value = this .getExecutionContext () .isLive_ .getValue () && this .isLive_ .getValue ();
				
				if (value)
					this .scene .beginUpdate ();
				else
					this .scene .endUpdate ();
			}
		},
		isExternProto: function ()
		{
			return true;
		},
		setProtoDeclaration: function (value)
		{
			this .proto = value;
		},
		getProtoDeclaration: function ()
		{
			return this .proto;
		},
		requestAsyncLoad: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);
			this .getScene () .addLoadCount (this);

			var Loader = require ("cobweb/InputOutput/Loader");

			new Loader (this) .createX3DFromURL (this .url_, this .setSceneAsync .bind (this));
		},
		setSceneAsync: function (value)
		{
			this .getScene () .removeLoadCount (this);
		
			if (value)
			{
				this .setScene (value);
			}
			else
			{
				this .setLoadState (X3DConstants .FAILED_STATE);
		
				this .scene = this .getBrowser () .getPrivateScene ();
		
				this .setProtoDeclaration (null);
			}
		},
		setScene: function (value)
		{
			this .scene = value;
		
			try
			{
				this .setLoadState (X3DConstants .COMPLETE_STATE);
		
				this .scene .isLive_ = this .getExecutionContext () .isLive_ .getValue () && this .isLive_ .getValue ();
				//this .scene .setExecutionContext (this .getExecutionContext ());
		
				this .scene .setup ();
		
				var protoName = this .scene .getURL () .fragment || 0;
		
				this .setProtoDeclaration (this .scene .protos [protoName]);
			}
			catch (error)
			{
			   console .log (error);

				this .setLoadState (X3DConstants .FAILED_STATE);
		
				this .scene = this .getBrowser () .getPrivateScene ();

				this .setProtoDeclaration (null);
			}
		},
	});

	return X3DExternProtoDeclaration;
});

