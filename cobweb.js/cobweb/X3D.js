
define ([
	"jquery",
	"cobweb/Error",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DField",
	"cobweb/Basic/X3DArrayField",
	"cobweb/Fields",
	"cobweb/Browser/X3DBrowser",
	"cobweb/Configuration/ComponentInfo",
	"cobweb/Configuration/ComponentInfoArray",
	"cobweb/Configuration/ProfileInfo",
	"cobweb/Configuration/ProfileInfoArray",
	"cobweb/Configuration/UnitInfo",
	"cobweb/Configuration/UnitInfoArray",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Execution/X3DScene",
	"cobweb/Prototype/ExternProtoDeclarationArray",
	"cobweb/Prototype/ProtoDeclarationArray",
	"cobweb/Prototype/X3DExternProtoDeclaration",
	"cobweb/Prototype/X3DProtoDeclaration",
	"cobweb/Routing/RouteArray",
	"cobweb/Routing/X3DRoute",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Error,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DField,
          X3DArrayField,
          Fields,
          X3DBrowser,
          ComponentInfo,
          ComponentInfoArray,
          ProfileInfo,
          ProfileInfoArray,
          UnitInfo,
          UnitInfoArray,
          X3DExecutionContext,
          X3DScene,
          ExternProtoDeclarationArray,
          ProtoDeclarationArray,
          X3DExternProtoDeclaration,
          X3DProtoDeclaration,
          RouteArray,
          X3DRoute,
          X3DConstants)
{
"use strict";

	// Console fallback

	if (! console)        console        = { };
	if (! console .log)   console .log   = function () { };
	if (! console .info)  console .info  = console .log;
	if (! console .warn)  console .warn  = console .log;
	if (! console .error) console .error = console .log;

	function getBrowser (dom)
	{
		return $(dom) .data ("browser");
	}

	function createBrowser (dom)
	{
		dom = $(dom);

		var browser = new X3DBrowser (dom);

		dom .data ("browser", browser);

		browser .setup ();

		if (dom .attr ("splashScreen") !== "false")
			browser .getCanvas () .fadeOut (0);
		
		return browser;
	}

	// X3D

	var
	   initialized = false,
		callbacks   = $.Deferred (),
		fallbacks   = $.Deferred ();

	function X3D (callback, fallback)
	{
		if (typeof callback === "function")
			callbacks .done (callback);

		if (typeof fallback === "function")
			fallbacks .done (fallback);

		if (initialized)
			return;

		initialized = true;

		$(function ()
		{
			var elements = $("X3D");
		
			try
			{
				$.map (elements, createBrowser);
	
				if (elements .length)
					callbacks .resolve (elements);
			}
			catch (error)
			{
				Error .fallback (elements);
				fallbacks .resolve (elements, error);
			}
		});
	}

	$.extend (X3D,
		Fields,
	{
		require:                     require,
		getBrowser:                  getBrowser,
		createBrowser:               createBrowser,
		X3DConstants:                X3DConstants,
		X3DFieldDefinition:          X3DFieldDefinition,
		FieldDefinitionArray:        FieldDefinitionArray,
		X3DField:                    X3DField,
		X3DArrayField:               X3DArrayField,
		X3DExecutionContext:         X3DExecutionContext,
		X3DScene:                    X3DScene,
		ComponentInfo:               ComponentInfo,
		ComponentInfoArray:          ComponentInfoArray,
		ProfileInfo:                 ProfileInfo,
		ProfileInfoArray:            ProfileInfoArray,
		UnitInfo:                    UnitInfo,
		UnitInfoArray:               UnitInfoArray,
		ExternProtoDeclarationArray: ExternProtoDeclarationArray,
		ProtoDeclarationArray:       ProtoDeclarationArray,
		X3DExterProtonDeclaration:   X3DExternProtoDeclaration,
		X3DProtoDeclaration:         X3DProtoDeclaration,
		RouteArray:                  RouteArray,
		X3DRoute:                    X3DRoute,
	});

	return X3D;
});
